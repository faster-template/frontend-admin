/* eslint-disable no-shadow */
import { SlateDescendant, SlateElement, SlateText } from '@wangeditor/editor';

declare module '@wangeditor/editor' {
  // 扩展 Text
  interface SlateText {
    text: string;
  }

  // 扩展 Element
  interface SlateElement {
    type: string;
    children: SlateDescendant[];
  }

  // 扩展 视频
  type VideoElement = SlateElement & {
    src: string;
    poster?: string;
  };
}
