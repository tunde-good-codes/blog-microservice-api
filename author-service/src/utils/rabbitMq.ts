import amqp from "amqplib";

// The channel variable to be used for publishing messages
let channel: amqp.Channel | undefined;

/**
 * Initializes the connection to the RabbitMQ server and creates a channel.
 * Uses the full connection URL from environment variables.
 */
export const connectRabbitMQ = async () => {
  try {
    const url = process.env.RABBITMQ_URL;
    if (!url) {
        throw new Error("RABBITMQ_URL environment variable is not set.");
    }

    // Connect using the full AMQPS URL (recommended for CloudAMQP)
    const connection = await amqp.connect(url);
    
    // Set up a listener for connection closure (good for resilience)
    connection.on('error', (err) => {
        console.error("❌ RabbitMQ Connection Error:", err.message);
    });
    
    // Create the channel for message operations
    channel = await connection.createChannel();

    console.log("✅ Connected to RabbitMQ");
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ", error);
    // You might want to implement a retry mechanism here in a real app
  }
};

/**
 * Publishes a message to the specified queue.
 */
export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.error("RabbitMQ channel is not initialized. Please call connectRabbitMQ first.");
    return;
  }

  try {
    // Ensure the queue exists and is durable (survives restarts)
    await channel.assertQueue(queueName, { durable: true });

    // Send the message, converting the JSON object to a Buffer
    const success = channel.sendToQueue(
        queueName, 
        Buffer.from(JSON.stringify(message)), 
        { persistent: true } // Message persists on disk until delivered
    );
    
    if (success) {
        console.log(`✉️ Message published to queue: ${queueName}`);
    } else {
        console.warn(`⚠️ Failed to publish message immediately to queue: ${queueName} (buffer full)`);
    }

  } catch (error) {
    console.error(`❌ Failed to Publish message to ${queueName}:`, error);
  }
};

/**
 * Specific application utility to publish a cache invalidation job.
 */
export const invalidateCacheJob = async (cacheKeys: string[]) => {
  const queueName = "cache-invalidation";
  try {
    const message = {
      action: "invalidateCache",
      keys: cacheKeys,
      timestamp: new Date().toISOString() // Added for better logging/tracing
    };

    await publishToQueue(queueName, message);

  } catch (error) {
    console.error(`❌ Failed to Publish cache invalidation job on RabbitMQ to ${queueName}:`, error);
  }
};