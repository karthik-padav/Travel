import Image from "next/image";

export default function Banner() {
    return (
            <div className="relative h-screen flex justify-center items-center">
                <div className="z-10 relative">
                    <h1 className="text-white font-bold uppercase text-7xl">Right Diversion</h1>
                </div>
                <Image
                    src="/images/banner.jpg"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    alt=""
                />
                <Image
                    src="/images/clouds.png"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    alt=""
                />
            </div>
    );
}
