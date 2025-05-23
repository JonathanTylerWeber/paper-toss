export default function LoadingScreen() {
  return (
    <div
      className="
        w-full
        h-full
        bg-[url('/paperTexture.jpg')]
        bg-cover
        bg-center
        flex
        items-center
        justify-center
        z-40
      "
    >
      <div className="flex flex-col items-center space-y-6">
        <img
          src="/crumpledPaper.svg"
          alt="Crumpled Paper"
          className="size-60 animate-bounce"
        />
        <div className="flex justify-center gap-3">
          <p className="text-7xl font-semibold font-mono">Loading</p>
          <div className="mt-8 flex items-end space-x-2 -translate-y-1">
            <div className="size-3 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
            <div className="size-3 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
            <div className="size-3 animate-bounce rounded-full bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
