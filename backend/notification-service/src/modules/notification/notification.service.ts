import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as admin from 'firebase-admin';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {}

  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    }
  }

  async findAll(userId: string) {
    return this.notificationModel.find({ recipient: userId }).sort({ createdAt: -1 }).limit(50).exec();
  }

  async markAsRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { isRead: true, readAt: new Date() }).exec();
  }

  async sendPushNotification(data: { recipient: string; title: string; body: string; data?: any; fcmTokens: string[] }) {
    const notification = new this.notificationModel({
      recipient: data.recipient,
      title: data.title,
      body: data.body,
      data: data.data,
    });
    await notification.save();

    if (data.fcmTokens && data.fcmTokens.length > 0) {
      const message: admin.messaging.MulticastMessage = {
        tokens: data.fcmTokens,
        notification: {
          title: data.title,
          body: data.body,
        },
        data: data.data ? Object.fromEntries(Object.entries(data.data).map(([k, v]) => [k, String(v)])) : {},
      };

      try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`${response.successCount} messages were sent successfully`);
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    }

    return notification;
  }
}
