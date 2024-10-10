import mongoose, { Document, Schema } from 'mongoose';
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types";

interface RegistrationChallengeDocument extends Document {
    registrationOptions: PublicKeyCredentialCreationOptionsJSON
    username: string;
}

const RegistrationChallengeSchema: Schema = new Schema({
    registrationOptions: { type: Schema.Types.Mixed, required: true },
    username: { type: String, required: true }
});

const RegistrationChallengeModel = mongoose.model<RegistrationChallengeDocument>('RegistrationChallenge', RegistrationChallengeSchema);

export default RegistrationChallengeModel;
