import { useId, useMemo, useState } from "react";
import { Component2 } from "./Component2";
import { Component2_1 } from "./Component2_1";
import component2 from "./component-2.png";
import { IconComponentNode } from "./IconComponentNode";

  const DivWFull = () => {
  const emailId = useId();
  const passwordId = useId();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const socialButtons = useMemo(
    () => [
      {
        id: "telegram",
        label: "ចូលបានតាមរយៈ Telegram",
        icon: <IconComponentNode className="!relative !w-4 !h-4" />,
        className:
          "flex h-9 items-center justify-center gap-2 pt-[6.5px] pb-[7.5px] px-3 relative self-stretch w-full bg-white rounded-[17.2px] border border-solid border-zinc-200 shadow-[0px_1px_2px_#0000000d]",
        overlay: true,
      },
      {
        id: "google",
        label: "ចូលបានតាមរយៈ Google",
        icon: <Component2_1 className="!relative !w-4 !h-4" />,
        className:
          "flex h-9 items-center justify-center gap-2 pt-[6.5px] pb-[7.5px] px-3 relative self-stretch w-full bg-white rounded-[17.2px] border border-solid border-zinc-200 shadow-[0px_1px_2px_#0000000d]",
      },
    ],
    [],
  );
  const login = () => {
    return (
      <main className="flex flex-col max-w-sm w-96 items-start relative">
        <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
          <section className="flex flex-col items-start gap-6 px-0 py-6 relative self-stretch flex-[0_0_auto] bg-white border border-solid border-zinc-200 w-full rounded-[23.2px]">
            <div className="w-full h-0" />
            <header className="flex flex-col items-center gap-6 px-6 py-0 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center justify-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
                <div
                  aria-hidden="true"
                  className="relative w-[60px] h-[60px] bg-[url(/login-logo-alt.png)] bg-contain bg-center bg-no-repeat shrink-0"
                />
                <div className="flex items-center justify-start relative flex-[0_0_auto]">
                  <div className="font-app-planessential-com-montserrat-bold font-[number:var(--planessential-com-montserrat-bold-font-weight)] text-[#f3003b] text-[length:var(--planessential-com-montserrat-bold-font-size)] tracking-[var(--planessential-com-montserrat-bold-letter-spacing)] leading-[var(--planessential-com-montserrat-bold-line-height)] whitespace-nowrap [font-style:var(--planessential-com-montserrat-bold-font-style)]">
                    PlanEssential
                  </div>
                </div>
              </div>
              <div className="flex items-start justify-center relative self-stretch w-full flex-[0_0_auto]">
                <h1 className="font-app-planessential-com-noto-sans-khmer-semibold font-[number:var(--app-planessential-com-noto-sans-khmer-semibold-font-weight)] text-zinc-950 text-[length:var(--app-planessential-com-noto-sans-khmer-semibold-font-size)] text-center tracking-[var(--app-planessential-com-noto-sans-khmer-semibold-letter-spacing)] leading-[var(--app-planessential-com-noto-sans-khmer-semibold-line-height)] [font-style:var(--app-planessential-com-noto-sans-khmer-semibold-font-style)]">
                  ចូលទៅកាន់គណនីរបស់អ្នក
                </h1>
              </div>
              <div className="flex items-start justify-center relative self-stretch w-full flex-[0_0_auto]">
                <p className="font-app-planessential-com-noto-sans-khmer-regular font-[number:var(--app-planessential-com-noto-sans-khmer-regular-font-weight)] text-[#70707b] text-[length:var(--app-planessential-com-noto-sans-khmer-regular-font-size)] text-left leading-8 tracking-[var(--app-planessential-com-noto-sans-khmer-regular-letter-spacing)] [font-style:var(--app-planessential-com-noto-sans-khmer-regular-font-style)]">
                  ចូលទៅកាន់គណនីរបស់អ្នកប្រកបដោយសុវត្ថិភាព និងភាពងាយ
                  <br />
                  ស្រួល។
                </p>
              </div>
            </header>
            <div className="flex flex-col items-start px-6 py-0 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-[15.5px] relative self-stretch w-full flex-[0_0_auto]">
                <form
                  className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                    <div className="flex items-start relative self-stretch w-full flex-[0_0_auto]">
                      <label
                        className="font-app-planessential-com-noto-sans-khmer-bold font-[number:var(--app-planessential-com-noto-sans-khmer-bold-font-weight)] text-zinc-950 text-[length:var(--app-planessential-com-noto-sans-khmer-bold-font-size)] tracking-[var(--app-planessential-com-noto-sans-khmer-bold-letter-spacing)] leading-[var(--app-planessential-com-noto-sans-khmer-bold-line-height)] [font-style:var(--app-planessential-com-noto-sans-khmer-bold-font-style)]"
                        htmlFor={emailId}
                      >
                        លេខទូរស័ព្ទ ឬ អ៊ីមែល
                      </label>
                    </div>
                    <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                      <input
                        id={emailId}
                        name="identifier"
                        type="text"
                        autoComplete="username"
                        value={identifier}
                        onChange={(event) => setIdentifier(event.target.value)}
                        placeholder="សូមបញ្ចូលលេខទូរស័ព្ទ ឬ អ៊ីមែល"
                        className="flex h-9 items-center self-stretch w-full rounded-[17.2px] border border-solid border-zinc-200 bg-[#ffffff01] px-5 py-0 shadow-[0px_1px_2px_#0000000d] font-app-planessential-com-noto-sans-khmer-regular font-[number:var(--app-planessential-com-noto-sans-khmer-regular-font-weight)] text-[#18181b] text-[length:var(--app-planessential-com-noto-sans-khmer-regular-font-size)] tracking-[var(--app-planessential-com-noto-sans-khmer-regular-letter-spacing)] leading-[var(--app-planessential-com-noto-sans-khmer-regular-line-height)] placeholder:text-[#a1a1aa] [font-style:var(--app-planessential-com-noto-sans-khmer-regular-font-style)]"
                      />
                    </div>
                  </div>
                  <div className="grid-rows-[54px_20px] h-[82px] grid grid-cols-[334px] gap-2">
                    <div className="flex items-end justify-end row-[2_/_3] col-[1_/_2]">
                      <div className="flex items-center justify-end w-full">
                        <a
                          className="font-app-planessential-com-noto-sans-khmer-regular-underline font-[number:var(--app-planessential-com-noto-sans-khmer-regular-underline-font-weight)] text-zinc-950 text-[length:var(--app-planessential-com-noto-sans-khmer-regular-underline-font-size)] text-right tracking-[var(--app-planessential-com-noto-sans-khmer-regular-underline-letter-spacing)] leading-[var(--app-planessential-com-noto-sans-khmer-regular-underline-line-height)] [font-style:var(--app-planessential-com-noto-sans-khmer-regular-underline-font-style)]"
                          href="https://app.planessential.com/forgot-password"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          ភ្លេចលេខសម្ងាត់?
                        </a>
                      </div>
                    </div>
                    <div className="relative row-[1_/_2] col-[1_/_2] w-full h-fit flex flex-col items-start gap-1">
                      <div className="flex items-start relative self-stretch w-full flex-[0_0_auto]">
                        <label
                          className="font-app-planessential-com-noto-sans-khmer-bold font-[number:var(--app-planessential-com-noto-sans-khmer-bold-font-weight)] text-zinc-950 text-[length:var(--app-planessential-com-noto-sans-khmer-bold-font-size)] tracking-[var(--app-planessential-com-noto-sans-khmer-bold-letter-spacing)] leading-[var(--app-planessential-com-noto-sans-khmer-bold-line-height)] [font-style:var(--app-planessential-com-noto-sans-khmer-bold-font-style)]"
                          htmlFor={passwordId}
                        >
                          លេខសម្ងាត់
                        </label>
                      </div>
                      <div className="items-start flex flex-col relative self-stretch w-full flex-[0_0_auto]">
                        <div className="relative self-stretch w-full">
                          <input
                            id={passwordId}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="បញ្ចូលលេខសម្ងាត់"
                            className="h-9 w-full bg-[#ffffff01] rounded-[17.2px] overflow-hidden border border-solid border-zinc-200 shadow-[0px_1px_2px_#0000000d] pl-5 pr-11 py-0 font-app-planessential-com-noto-sans-khmer-regular font-[number:var(--app-planessential-com-noto-sans-khmer-regular-font-weight)] text-[#18181b] text-[length:var(--app-planessential-com-noto-sans-khmer-regular-font-size)] tracking-[var(--app-planessential-com-noto-sans-khmer-regular-letter-spacing)] leading-[var(--app-planessential-com-noto-sans-khmer-regular-line-height)] placeholder:text-[#a1a1aa] [font-style:var(--app-planessential-com-noto-sans-khmer-regular-font-style)]"
                          />
                          <button
                            type="button"
                            aria-label={
                              showPassword ? "លាក់លេខសម្ងាត់" : "បង្ហាញលេខសម្ងាត់"
                            }
                            aria-pressed={showPassword}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="inline-flex items-center pl-0 pr-3 py-[9px] absolute h-full top-0 right-0"
                          >
                            <Component2 className="!relative !w-[18px] !h-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="flex h-9 items-center justify-center pt-[7.5px] pb-[8.5px] px-4 relative self-stretch w-full bg-[#d2002d] rounded-[17.2px] shadow-[0px_1px_2px_#0000000d]"
                  >
                    <div className="flex items-center justify-center w-fit mt-[-1.00px] font-app-planessential-com-noto-sans-khmer-medium font-[number:var(--app-planessential-com-noto-sans-khmer-medium-font-weight)] text-[#fef0f1] text-[length:var(--app-planessential-com-noto-sans-khmer-medium-font-size)] text-center leading-[var(--app-planessential-com-noto-sans-khmer-medium-line-height)] whitespace-nowrap relative tracking-[var(--app-planessential-com-noto-sans-khmer-medium-letter-spacing)] [font-style:var(--app-planessential-com-noto-sans-khmer-medium-font-style)]">
                      ចូល
                    </div>
                  </button>
                  <div className="items-center pt-0 pb-px px-0 flex flex-col relative self-stretch w-full flex-[0_0_auto]">
                    <div className="absolute w-full h-[127.14%] top-[47.62%] left-0 border-t [border-top-style:solid] border-zinc-200" />
                    <div className="inline-flex items-start justify-center px-2 py-0 relative flex-[0_0_auto] bg-white">
                      <div className="flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Noto_Sans_Khmer-Regular',Helvetica] font-normal text-[#70707b] text-sm text-center leading-5 whitespace-nowrap relative tracking-[0]">
                        ឬ
                      </div>
                    </div>
                  </div>
                  {socialButtons.map((button) => (
                    <div
                      key={button.id}
                      className="items-start flex flex-col relative self-stretch w-full flex-[0_0_auto]"
                    >
                      <button type="button" className={button.className}>
                        {button.icon}
                        <div className="relative flex items-center justify-center w-fit font-app-planessential-com-noto-sans-khmer-medium font-[number:var(--app-planessential-com-noto-sans-khmer-medium-font-weight)] text-zinc-950 text-[length:var(--app-planessential-com-noto-sans-khmer-medium-font-size)] text-center tracking-[var(--app-planessential-com-noto-sans-khmer-medium-letter-spacing)] leading-[var(--app-planessential-com-noto-sans-khmer-medium-line-height)] whitespace-nowrap [font-style:var(--app-planessential-com-noto-sans-khmer-medium-font-style)]">
                          {button.label}
                        </div>
                      </button>
                      {button.overlay ? (
                        <div className="flex w-full h-full items-center justify-center absolute top-0 left-0 opacity-0 pointer-events-none">
                          <div className="flex flex-col w-[219px] h-10 items-start relative mt-[-2.00px] mb-[-2.00px]">
                            <div className="flex flex-col items-center pl-0 pr-[0.55px] py-0 relative self-stretch w-full flex-[0_0_auto]">
                              <div className="inline-flex items-start relative flex-[0_0_auto]">
                                <div className="inline-flex items-start justify-center gap-[13px] pl-3.5 pr-[21px] py-[9px] relative flex-[0_0_auto] bg-[#54a9eb] rounded-[20px] overflow-hidden">
                                  <div className="relative w-6 h-[22px] overflow-hidden">
                                    <img
                                      className="absolute top-[-5530px] left-[42179px] w-6 h-6"
                                      alt="Component"
                                      src={component2}
                                    />
                                  </div>
                                  <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-app-planessential-com-inter-medium font-[number:var(--app-planessential-com-inter-medium-font-weight)] text-white text-[length:var(--app-planessential-com-inter-medium-font-size)] text-center tracking-[var(--app-planessential-com-inter-medium-letter-spacing)] leading-[var(--app-planessential-com-inter-medium-line-height)] whitespace-nowrap [font-style:var(--app-planessential-com-inter-medium-font-style)]">
                                    Log in with Telegram
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </form>
                <div className="flex items-start justify-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Noto_Sans_Khmer-Regular',Helvetica] font-normal text-zinc-950 text-sm text-center leading-5 whitespace-nowrap relative tracking-[0]">
                    មិនទាន់មានគណនីមែនទេ?
                  </div>
                  <a
                    className="inline-flex flex-col items-start relative self-stretch flex-[0_0_auto]"
                    href="https://app.planessential.com/signup"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                      <span className="flex items-center justify-center w-fit mt-[-1.00px] font-app-planessential-com-noto-sans-khmer-bold font-[number:var(--app-planessential-com-noto-sans-khmer-bold-font-weight)] text-[#c60035] text-[length:var(--app-planessential-com-noto-sans-khmer-bold-font-size)] text-center leading-[var(--app-planessential-com-noto-sans-khmer-bold-line-height)] whitespace-nowrap relative tracking-[var(--app-planessential-com-noto-sans-khmer-bold-letter-spacing)] [font-style:var(--app-planessential-com-noto-sans-khmer-bold-font-style)]">
                        ចុះឈ្មោះនៅទីនេះ
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>
          <footer className="flex flex-col items-center pt-[10.5px] pb-[9.5px] px-0 relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Noto_Sans_Khmer-Regular',Helvetica] font-normal text-[#70707b] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
              កំណែលេខ 1.2.0 - production
            </div>
          </footer>
        </div>
      </main>

    )
  }

  export default login;