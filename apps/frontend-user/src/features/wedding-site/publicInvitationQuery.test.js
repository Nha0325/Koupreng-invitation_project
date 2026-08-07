import { describe, expect, it } from "vitest";

import { resolveInviteToken } from "./publicInvitationQuery";

describe("resolveInviteToken", () => {
    it("uses token, i, and links in canonical priority order", () => {
        expect(resolveInviteToken(new URLSearchParams("token=primary&i=secondary&links=legacy"))).toBe("primary");
        expect(resolveInviteToken(new URLSearchParams("i=secondary&links=legacy"))).toBe("secondary");
        expect(resolveInviteToken(new URLSearchParams("links=opaque-secure-token"))).toBe("opaque-secure-token");
        expect(resolveInviteToken(new URLSearchParams())).toBe("");
    });
});
