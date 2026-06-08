package com.koupreng.backend.controller;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.ApiResponse;
import com.koupreng.backend.service.MessageService;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class I18nController {

    private static final Map<String, List<String>> NAMESPACE_KEYS = Map.of(
            "hostNav", List.of(
                    "hostNav.events",
                    "hostNav.dashboard",
                    "hostNav.guests",
                    "hostNav.expenses",
                    "hostNav.gifts",
                    "hostNav.templates",
                    "hostNav.logout",
                    "hostNav.editProfile",
                    "hostNav.createProfile"
            ),
            "dashboard", List.of(
                    "dashboard.brand",
                    "dashboard.emptyTitle",
                    "dashboard.emptyText",
                    "dashboard.createInvitation",
                    "dashboard.eventSwitcherAria",
                    "dashboard.eventSwitcherTitle",
                    "dashboard.keepTwo",
                    "dashboard.keepTwoConfirm",
                    "dashboard.active",
                    "dashboard.overview",
                    "dashboard.title",
                    "dashboard.description",
                    "dashboard.guests",
                    "dashboard.editInvitation",
                    "dashboard.invitedGuests",
                    "dashboard.responses",
                    "dashboard.rsvpReady",
                    "dashboard.attending",
                    "dashboard.budgetUsed",
                    "dashboard.spent",
                    "dashboard.giftTotal",
                    "dashboard.records",
                    "dashboard.planHealth",
                    "dashboard.rsvpCompletion",
                    "dashboard.weddingDate",
                    "dashboard.giftRecords",
                    "dashboard.published",
                    "dashboard.draft",
                    "dashboard.eventDate",
                    "dashboard.venue",
                    "dashboard.notCompleted",
                    "dashboard.rsvp",
                    "dashboard.open",
                    "dashboard.closed",
                    "dashboard.preview",
                    "dashboard.totalGuests",
                    "dashboard.invitedResponded",
                    "dashboard.rsvpProgress",
                    "dashboard.rsvpProgressNote",
                    "dashboard.budgetProgress",
                    "dashboard.budgetProgressNote",
                    "dashboard.giftSummary",
                    "dashboard.giftSummaryNote",
                    "dashboard.graph",
                    "dashboard.rsvpGuests",
                    "dashboard.accepted",
                    "dashboard.pending",
                    "dashboard.maybe",
                    "dashboard.declined",
                    "dashboard.recentGuests",
                    "dashboard.newGuests",
                    "dashboard.viewAll",
                    "dashboard.noGroup",
                    "dashboard.noGuests",
                    "dashboard.event",
                    "dashboard.summary",
                    "dashboard.edit",
                    "dashboard.template",
                    "dashboard.newEvent",
                    "dashboard.noDate",
                    "dashboard.wedding",
                    "dashboard.weddingTemplate"
            )
    );

    private final MessageService msg;

    public I18nController(MessageService msg) {
        this.msg = msg;
    }

    @GetMapping("/api/v1/i18n/messages")
    public ResponseEntity<ApiResponse<Map<String, Object>>> messages(
            @RequestParam(defaultValue = "dashboard") String namespace
    ) {
        List<String> keys = NAMESPACE_KEYS.get(namespace);
        if (keys == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, msg.get("error.bad-request"));
        }

        Map<String, String> messages = new LinkedHashMap<>();
        String prefix = namespace + ".";
        for (String key : keys) {
            messages.put(key.substring(prefix.length()), msg.get(key));
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("locale", LocaleContextHolder.getLocale().toLanguageTag());
        data.put("namespace", namespace);
        data.put("messages", messages);
        return ResponseEntity.ok(ApiResponse.success("Messages fetched successfully", data));
    }
}
