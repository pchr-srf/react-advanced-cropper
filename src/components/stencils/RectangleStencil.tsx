import React, { ComponentType, forwardRef, useImperativeHandle } from 'react';
import cn from 'classnames';
import {
	CardinalDirection,
	OrdinalDirection,
	CropperImage,
	MoveDirections,
	ResizeDirections,
	CropperState,
	CropperTransitions,
	RawAspectRatio,
	CropperInteractions,
} from 'advanced-cropper';
import { createAspectRatio, getStencilCoordinates } from 'advanced-cropper/service';
import { ResizeOptions } from 'advanced-cropper/state';
import { SimpleLine } from '../lines/SimpleLine';
import { SimpleHandler } from '../handlers/SimpleHandler';
import { BoundingBox } from '../service/BoundingBox';
import { StencilOverlay } from '../service/StencilOverlay';
import { DraggableArea } from '../service/DraggableArea';
import { StencilWrapper } from '../service/StencilWrapper';
import { StencilGrid } from '../service/StencilGrid';

type HandlerComponent = ComponentType<any>;

type LineComponent = ComponentType<any>;

interface HandlerClassNames extends Partial<Record<OrdinalDirection, string>> {
	default?: string;
	disabled?: string;
	hover?: string;
}

interface LineClassNames extends Partial<Record<CardinalDirection, string>> {
	default?: string;
	disabled?: string;
	hover?: string;
}

interface DesiredCropperRef {
	getState: () => CropperState;
	getTransitions: () => CropperTransitions;
	getInteractions: () => CropperInteractions;
	hasInteractions: () => boolean;
	resizeCoordinates: (directions: ResizeDirections, options: ResizeOptions) => void;
	resizeCoordinatesEnd: () => void;
	moveCoordinates: (directions: MoveDirections) => void;
	moveCoordinatesEnd: () => void;
	refresh: () => void;
}

interface Props {
	cropper: DesiredCropperRef;
	image?: CropperImage | null;
	handlerComponent?: HandlerComponent;
	handlers?: Partial<Record<OrdinalDirection, boolean>>;
	handlerClassNames?: HandlerClassNames;
	handlerWrapperClassNames?: HandlerClassNames;
	lines?: Partial<Record<CardinalDirection, boolean>>;
	lineComponent?: LineComponent;
	lineClassNames?: LineClassNames;
	lineWrapperClassNames?: LineClassNames;
	movingClassName?: string;
	resizingClassName?: string;
	gridClassName?: string;
	previewClassName?: string;
	boundingBoxClassName?: string;
	overlayClassName?: string;
	draggableAreaClassName?: string;
	minAspectRatio?: number;
	maxAspectRatio?: number;
	aspectRatio?: number;
	movable?: boolean;
	resizable?: boolean;
	grid?: boolean;
}

interface Methods {
	aspectRatio: RawAspectRatio;
}

export const RectangleStencil = forwardRef<Methods, Props>(
	(
		{
			cropper,
			aspectRatio,
			minAspectRatio,
			maxAspectRatio,
			handlerComponent = SimpleHandler,
			handlers = {
				eastNorth: true,
				north: true,
				westNorth: true,
				west: true,
				westSouth: true,
				south: true,
				eastSouth: true,
				east: true,
			},
			handlerClassNames = {},
			handlerWrapperClassNames = {},
			lines = {
				west: true,
				north: true,
				east: true,
				south: true,
			},
			lineComponent = SimpleLine,
			lineClassNames = {},
			lineWrapperClassNames = {},
			resizable = true,
			movable = true,
			grid,
			gridClassName,
			movingClassName,
			resizingClassName,
			previewClassName,
			boundingBoxClassName,
			overlayClassName,
			draggableAreaClassName,
		}: Props,
		ref,
	) => {
		const state = cropper.getState();
		const transitions = cropper.getTransitions();
		const interactions = cropper.getInteractions();

		useImperativeHandle(ref, () => ({
			aspectRatio: createAspectRatio(
				aspectRatio || {
					minimum: minAspectRatio,
					maximum: maxAspectRatio,
				},
			),
		}));

		const onMove = (directions: MoveDirections) => {
			if (cropper && movable) {
				cropper.moveCoordinates(directions);
			}
		};

		const onMoveEnd = () => {
			if (cropper) {
				cropper.moveCoordinatesEnd();
			}
		};

		const onResize = (directions: ResizeDirections, options: ResizeOptions) => {
			if (cropper && resizable) {
				cropper.resizeCoordinates(directions, options);
			}
		};

		const onResizeEnd = () => {
			if (cropper) {
				cropper.resizeCoordinatesEnd();
			}
		};

		const { width, height, left, top } = getStencilCoordinates(state);

		return (
			state && (
				<StencilWrapper
					className={cn(
						'advanced-cropper-rectangle-stencil',
						movable && 'advanced-cropper-rectangle-stencil--movable',
						interactions.moveCoordinates && 'advanced-cropper-rectangle-stencil--moving',
						resizable && 'advanced-cropper-rectangle-stencil--resizable',
						interactions.resizeCoordinates && 'advanced-cropper-rectangle-stencil--resizing',
						interactions.moveCoordinates && movingClassName,
						interactions.resizeCoordinates && resizingClassName,
					)}
					width={width}
					height={height}
					left={left}
					top={top}
					transitions={transitions}
				>
					<BoundingBox
						className={cn(boundingBoxClassName, 'advanced-cropper-rectangle-stencil__bounding-box')}
						handlers={handlers}
						handlerComponent={handlerComponent}
						handlerClassNames={handlerClassNames}
						handlerWrapperClassNames={handlerWrapperClassNames}
						lines={lines}
						lineComponent={lineComponent}
						lineClassNames={lineClassNames}
						lineWrapperClassNames={lineWrapperClassNames}
						onResize={onResize}
						onResizeEnd={onResizeEnd}
						disabled={!resizable}
					>
						<DraggableArea
							disabled={!movable}
							onMove={onMove}
							onMoveEnd={onMoveEnd}
							className={cn('advanced-cropper-rectangle-stencil__draggable-area', draggableAreaClassName)}
						>
							<StencilOverlay
								className={cn('advanced-cropper-rectangle-stencil__overlay', overlayClassName)}
							>
								{grid && (
									<StencilGrid
										visible={cropper.hasInteractions()}
										columns={interactions.transformImage.rotate ? 9 : 3}
										rows={interactions.transformImage.rotate ? 9 : 3}
										className={cn('advanced-cropper-rectangle-stencil__grid', gridClassName)}
									/>
								)}
								<div className={cn('advanced-cropper-rectangle-stencil__preview', previewClassName)} />
							</StencilOverlay>
						</DraggableArea>
					</BoundingBox>
				</StencilWrapper>
			)
		);
	},
);

RectangleStencil.displayName = 'RectangleStencil';
