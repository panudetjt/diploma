import dynamic from "next/dynamic";

const ImageEditor = dynamic(() => import("~/components/image-editor").then(c => c.ImageEditor), { ssr: false });

export default function Home() {
  return (
    <main>
      <ImageEditor />
    </main>
  );
}
