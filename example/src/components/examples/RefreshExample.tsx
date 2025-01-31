import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import {
	ImageRestriction,
	BoundingBox,
	CropperRef,
	Cropper,
	useWindowResize,
	ResizeDirections,
} from 'react-advanced-cropper';
import './RefreshExample.scss';

export const RefreshExample = () => {
	const cropperRef = useRef<CropperRef>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [left, setLeft] = useState(0);
	const [top, setTop] = useState(0);

	const updateCoordinates = (width, height) => {
		const container = containerRef.current;
		if (container) {
			const resultWidth = Math.min(Math.max(0, width), container.clientWidth);
			const resultHeight = Math.min(Math.max(0, height), container.clientHeight);
			setWidth(resultWidth);
			setHeight(resultHeight);
			setLeft(container.clientWidth / 2 - resultWidth / 2);
			setTop(container.clientHeight / 2 - resultHeight / 2);
			if (cropperRef.current) {
				cropperRef.current.refresh();
			}
		}
	};

	const refresh = () => {
		updateCoordinates(width, height);
	};

	const onResize = (resize: ResizeDirections) => {
		const container = containerRef.current;
		if (container) {
			const directions = { ...resize };

			if (directions.left) {
				directions.right = directions.left;
			}
			if (directions.right) {
				directions.left = directions.right;
			}
			if (directions.top) {
				directions.bottom = directions.top;
			}
			if (directions.bottom) {
				directions.top = directions.bottom;
			}

			updateCoordinates(width + directions.left + directions.right, height + directions.top + directions.bottom);
		}
	};

	useWindowResize(() => {
		refresh();
	});

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			updateCoordinates(container.clientWidth, container.clientHeight);
		}
	}, []);

	const boxStyle: CSSProperties = {
		width: `${width}px`,
		height: `${height}px`,
		left: `${left}px`,
		top: `${top}px`,
	};

	return (
		<div className={'refresh-example'} ref={containerRef}>
			<BoundingBox
				style={boxStyle}
				className="refresh-example__wrapper"
				onResize={onResize}
				lineClassNames={{
					default: 'refresh-example__line',
				}}
				handlerClassNames={{
					default: 'refresh-example__handler',
				}}
			>
				<Cropper
					ref={cropperRef}
					className={'refresh-example__cropper'}
					src={'/react-advanced-cropper/img/images/photo-1553301208-a3718cc0150e.jpg'}
					stencilProps={{
						aspectRatio: 1,
					}}
					minWidth={200}
					minHeight={300}
					imageRestriction={ImageRestriction.fillArea}
				/>
			</BoundingBox>
		</div>
	);
};
