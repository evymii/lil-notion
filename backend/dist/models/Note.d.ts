import mongoose from "mongoose";
type NoteDocument = {
    name: string;
    content: string;
    subject: string;
    created: Date;
};
export declare const Note: mongoose.Model<NoteDocument, {}, {}, {}, mongoose.Document<unknown, {}, NoteDocument, {}, mongoose.DefaultSchemaOptions> & NoteDocument & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, NoteDocument>;
export {};
//# sourceMappingURL=Note.d.ts.map