import Image from "next/image";

const imageClassName =
  "pointer-events-none absolute right-0 top-0 size-[130px] select-none";

export function AgentStatusGraphic() {
  return (
    <>
      <Image
        src="/agent-status-illustration-light.png"
        alt=""
        width={130}
        height={130}
        aria-hidden
        className={`${imageClassName} dark:hidden`}
      />
      <Image
        src="/agent-status-illustration.svg"
        alt=""
        width={130}
        height={130}
        unoptimized
        aria-hidden
        className={`${imageClassName} hidden dark:block`}
      />
    </>
  );
}
