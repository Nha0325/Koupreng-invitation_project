export function resolveInviteToken(searchParams) {
    return searchParams.get("token") || searchParams.get("i") || searchParams.get("links") || "";
}
