"use client";

import { defaultImages } from "@/constants/images";
// import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Key, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { FormErrors } from "./form-errors";

interface FormPickerProps {
	id: string;
	errors?: Record<string, string[] | undefined>;
}

interface Image {
	id: string;
	urls: {
		thumb: string;
		full: string;
	};
	links: {
		html: string;
	};
	user: {
		name: string;
	};
	// other properties
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
	const { pending } = useFormStatus();

	const [images, setImages] = useState<Array<Image>>(defaultImages);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedImageId, setSelectedImageId] = useState<null | unknown>(
		null
	);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				throw new Error("Not implemented");
				// const result = await unsplash.photos.getRandom({
				// 	collectionIds: ["317099"],
				// 	count: 9,
				// });

				// if (result && result.response) {
				// 	const newImages = result.response as unknown as Array<
				// 		Record<string, unknown>
				// 	>;
				// 	setImages(newImages);
				// } else {
				// 	console.log("Failed to fetch images");
				// }
			} catch (error) {
				setImages(images);
			} finally {
				setIsLoading(false);
			}
		};

		fetchImages();
	}, []);

	if (isLoading) {
		return (
			<div className="p-6 flex items-center justify-center">
				<Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
			</div>
		);
	}

	return (
		<div className="relative">
			<div className="grid grid-cols-3 gap-2 mb-2">
				{images.map((image) => (
					<div
						key={image.id as Key}
						className={cn(
							"cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
							pending && "opacity-50 hover:opacity-50 cursor-auto"
						)}
						onClick={() => {
							if (pending) return;
							setSelectedImageId(image.id);
						}}
					>
						<input
							type="radio"
							name={id}
							id={id}
							className="hidden"
							checked={selectedImageId === image.id}
							disabled={pending}
							value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
						/>

						<Image
							alt="Unsplash image"
							src={image.urls.thumb}
							fill
							className="object-cover rounded-sm"
						/>

						{selectedImageId === image.id && (
							<div className="absolute inset-y-0 h-full w-full bg-black/60 flex items-center  justify-center">
								<Check className="h-4 w-4 text-white" />
							</div>
						)}

						<Link
							href={image.links.html}
							target="_blank"
							className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline bg-black/50 "
						>
							{image.user.name} on Pixels
						</Link>
					</div>
				))}
			</div>

			<FormErrors id="image" errors={errors || {}} />
		</div>
	);
};
