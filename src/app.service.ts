import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { ImageKitSignature } from './types/image-kit';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getSignatureIK(): ImageKitSignature {
    const imagekit = new ImageKit({
      publicKey: 'public_XW2lpEmMP3Yheqwa65ZSwGqD0dI=',
      privateKey: process.env.IMAGE_KIT_KEY || '',
      urlEndpoint: 'https://ik.imagekit.io/resdev',
    });
    return imagekit.getAuthenticationParameters();
  }
}
