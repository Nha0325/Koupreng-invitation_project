import httpx

import start


def test_webhook_instructions_never_print_complete_token(monkeypatch, capsys):
    token = "1234567890:test-token-value-that-must-stay-secret"
    monkeypatch.setattr(start, "BOT_TOKEN", token)

    start.print_webhook_instructions()

    output = capsys.readouterr().out
    assert token not in output
    assert "<TELEGRAM_BOT_TOKEN>" in output


def test_token_check_network_error_does_not_print_request_url(monkeypatch, capsys):
    token = "1234567890:test-token-value-that-must-stay-secret"
    monkeypatch.setattr(start, "BOT_TOKEN", token)

    def fail_request(url, timeout):
        request = httpx.Request("GET", url)
        raise httpx.ReadTimeout("request failed", request=request)

    monkeypatch.setattr(start.httpx, "get", fail_request)
    start.check_token()

    output = capsys.readouterr().out
    assert token not in output
    assert "api.telegram.org" not in output
    assert "ReadTimeout" in output
