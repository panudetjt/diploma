import dynamic from "next/dynamic";

const ImageEditor = dynamic(() => import("~/components/image-editor").then(c => c.ImageEditor), { ssr: false });

export default function Home() {
  return (
    <main className="p-4">
      <ImageEditor />
    </main>
  );
}
