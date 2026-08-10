export function canManageOrganization(ownerUserId, currentUserId) {
  return ownerUserId != null
    && currentUserId != null
    && String(ownerUserId) === String(currentUserId);
}
