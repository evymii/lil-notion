import mongoose from "mongoose";
type SubjectDocument = {
    name: string;
    createdAt: Date;
};
export declare const Subject: mongoose.Model<SubjectDocument, {}, {}, {}, mongoose.Document<unknown, {}, SubjectDocument, {}, mongoose.DefaultSchemaOptions> & SubjectDocument & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, SubjectDocument>;
export {};
//# sourceMappingURL=Subject.d.ts.map