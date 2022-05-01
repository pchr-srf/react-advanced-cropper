import React, { useState, useRef } from 'react';
import { CropperRef, Cropper, Coordinates } from 'react-advanced-cropper';
import { PreviewResults } from '../../components/examples/components/PreviewResults';
import './GettingResultManualExample.scss';

export const GettingResultManualExample = () => {
	const cropperRef = useRef<CropperRef>(null);

	const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

	const [preview, setPreview] = useState<string>();

	const [image] = useState(
		'https://images.unsplash.com/photo-1586083718719-019f9dc6ca94?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80',
	);

	const onCrop = () => {
		if (cropperRef.current) {
			setCoordinates(cropperRef.current.getCoordinates());
			setPreview(cropperRef.current.getCanvas()?.toDataURL());
		}
	};

	return (
		<div className={'getting-result-manual-example'}>
			<Cropper
				ref={cropperRef}
				className={'getting-result-manual-example__cropper'}
				stencilProps={{ aspectRatio: 1 }}
				src={image}
			/>
			<div className={'getting-result-manual-example__crop-button'} onClick={onCrop}>
				Crop Image
			</div>
			{coordinates && preview && <PreviewResults coordinates={coordinates} preview={preview} />}
		</div>
	);
};
