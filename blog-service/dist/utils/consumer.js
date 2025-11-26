import amqp from "amqplib";
import { redisClient } from "../server.js";
const MAX_RETRIES = 3;
/**
 * Connects to RabbitMQ and starts consuming cache invalidation messages.
 */
export const startCacheConsumer = async () => {
    try {
        const url = process.env.RABBITMQ_URL; // Use the single, secure URL
        if (!url) {
            throw new Error("RABBITMQ_URL environment variable is not set.");
        }
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        const queueName = "cache-invalidation";
        // 1. Assert the queue (must match producer)
        await channel.assertQueue(queueName, { durable: true });
        // 2. Set prefetch to 1 to ensure a consumer only gets a new message
        //    after acknowledging the previous one (ensures fair distribution)
        channel.prefetch(1);
        console.log("✅ Blog Service cache consumer started. Waiting for messages...");
        // 3. Start consuming messages
        channel.consume(queueName, async (msg) => {
            if (!msg) {
                return; // No message content, just return
            }
            let requeue = true;
            try {
                const content = JSON.parse(msg.content.toString());
                console.log("📩 Blog service received cache invalidation message:", content);
                if (content.action === "invalidateCache") {
                    for (const pattern of content.keys) {
                        // Find all keys matching the pattern (e.g., 'blogs:*' or 'blog:123')
                        const keys = await redisClient.keys(pattern);
                        if (keys.length > 0) {
                            await redisClient.del(keys);
                            console.log(`🗑️ Blog service invalidated ${keys.length} cache keys matching: ${pattern}`);
                        }
                    }
                }
                // 4. Successful processing: Acknowledge and do not requeue
                requeue = false;
                channel.ack(msg);
            }
            catch (error) {
                console.error("❌ Error processing cache invalidation in blog service:", error);
                // 5. Error handling: Get current retry count (optional advanced feature)
                // For simplicity, we'll implement a basic check or just reject.
                // If the error is due to bad data (JSON parse failure), do not requeue
                // If it's a transient error (e.g., Redis down), we might want to retry.
                // Simple rejection (assuming most errors here are due to bad data/code)
                // Set requeue to false to send it to the DLQ if configured, or drop it.
                requeue = false;
                channel.nack(msg, false, requeue);
            }
            finally {
                // If you were to implement a retry count, you would use it here.
            }
        });
    }
    catch (error) {
        console.error("❌ Failed to start RabbitMQ consumer:", error);
        // Add logic here to retry connection if needed
    }
};
