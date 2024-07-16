import { Message } from '@arco-design/web-vue';

export const copy2clipboard = (text) => {
  const copyipt = document.createElement('input');
  copyipt.setAttribute('value', text);
  document.body.appendChild(copyipt);
  copyipt.select();
  const result = document.execCommand('Copy', false, undefined);
  document.body.removeChild(copyipt);
  if (result) {
    Message.success(`复制成功:${text}`);
  } else {
    Message.error(`复制失败:${text}`);
  }
  return !!result;
};

export default null;
