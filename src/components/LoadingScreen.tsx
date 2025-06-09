export default function LoadingScreen() {
  return (
    <div
      className="
        w-full
        h-full
        bg-[url('/images/paperTexture.jpg')]
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
          src="/images/crumpledPaper.svg"
          alt="Crumpled Paper"
          className="size-40 lg:size-60 animate-bounce z-40"
        />
        <div className="flex justify-center gap-3 z-50">
          <p className="text-3xl md:text-5xl xl:text-7xl font-semibold font-mono">
            Loading
          </p>
          <div className="mt-8 flex items-end space-x-2 -translate-y-1">
            <div className="size-2 md:size-3 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
            <div className="size-2 md:size-3 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
            <div className="size-2 md:size-3 animate-bounce rounded-full bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
