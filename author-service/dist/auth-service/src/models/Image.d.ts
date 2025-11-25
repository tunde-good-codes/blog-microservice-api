import mongoose, { Document } from 'mongoose';
export interface IImage extends Document {
    file_id: string;
    url: string;
    userId?: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IImage, {}, {}, {}, mongoose.Document<unknown, {}, IImage, {}, {}> & IImage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Image.d.ts.map