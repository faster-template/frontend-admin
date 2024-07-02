export const state = {
  '-2': 'disabled',
  '-1': 'deleted',
  '0': 'draft',
  '1': 'normal',
  '2': 'pending',
};
// --- 下方正则和后端请保持同步
export const RegPassword = {
  match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,20}$/,
  message: '密码限制6-20字，包含大小写',
};
export const RegPhone = { match: /^1[3-9]\d{9}$/, message: '手机号格式不正确' };
export const RegNickName = {
  match: /^[\u4e00-\u9fa5A-Za-z]{4,10}$/,
  message: '昵称限制4-10字，仅支持中英文',
};
export const RegUserName = { match: /^[A-Za-z]{4,10}$/, message: '用户名限制4-10字，仅支持英文' };

export default null;
