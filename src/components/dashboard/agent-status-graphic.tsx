import Image from "next/image";

export function AgentStatusGraphic() {
  return (
    <Image
      src="/agent-status-illustration.svg"
      alt=""
      width={130}
      height={130}
      unoptimized
      aria-hidden
      className="pointer-events-none absolute right-0 top-0 size-[130px] select-none"
    />
  );
}
