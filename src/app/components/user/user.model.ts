import debug from 'debug';
import { Document, Model, model, Schema } from 'mongoose';
import { createToken } from '../../core/jwt';
import { hashPassword } from './user.helpers';
import { TNullable } from '../../types';

const logger = debug('app:src/app/components/user/user.model.ts');

export interface IUser extends Document {
  confirmed: boolean;
  confirmedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  lastLoginAt: TNullable<Date>;
  lastLogoutAt: TNullable<Date>;
  password: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  gdprConfirmed: boolean;
}

interface IUserModel extends Model<IUser> {
  forgotPassword(email: string): Promise<IUser>;
  resetPassword(newPassword: string, passwordResetToken: string): Promise<IUser>;
}

/**
 * User schema
 */
export type TUserModel = IUser & Document;

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    gdprConfirmed: {
      type: Boolean,
      default: false,
      required: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLogoutAt: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * pre-save hook
 */
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err as any);
  }
});

userSchema.statics.forgotPassword = async function (email: string): Promise<IUser | unknown> {
  try {
    const passwordResetToken = createToken({ email }, '3h');
    const updatedUser = await this.findOneAndUpdate(
      { email },
      { $set: { passwordResetToken } },
      { upsert: false, new: true }
    );
    return updatedUser;
  } catch (err) {
    logger('forgotPassword:: err: ', err);
    return err;
  }
};

userSchema.statics.resetPassword = async function (
  newPassword: string,
  passwordResetToken: string
): Promise<IUser | unknown> {
  try {
    const hashedPassword = await hashPassword(newPassword);
    const user = await this.findOne({ passwordResetToken });
    if (!user) throw new Error('resetPassword: user not found');

    const updatedUser = await this.findOneAndUpdate(
      { passwordResetToken },
      {
        $set: {
          password: hashedPassword,
          lastLogout: Date.now(),
        },
        $unset: { passwordResetToken: '' },
      },
      { upsert: false, new: true }
    );
    return updatedUser;
  } catch (err) {
    logger('forgotPassword:: err: ', err);
    return err;
  }
};

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);
