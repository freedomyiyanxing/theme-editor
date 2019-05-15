export const promptMsg = {
  _delete: 'Are you sure you want to remove the section/banner/picture? This action cannot be reversed.',
  _releaseSuccess: 'The theme has been published.',
  _noEdit: 'Cannot save without any modifications.',
  _save: 'Changes saved.',
}
export const promptDelete = bool => `Are you sure you want to remove the section ${bool ? 'banner' : 'picture'}? This action cannot be reversed.`;
export const promptImgFormat = index => `The section requires to include at least ${index}`;
export const promptRecover = str => `The theme has been reverted to ${str}.`
