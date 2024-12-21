"use client";

import {
  Grid,
  Layers,
  Map,
  Map as MapIcon,
  Mountain,
  Pencil,
  Pentagon,
  Satellite,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MapControls({
  mapType,
  zoomLevel,
  drawingMode,
  hasPolygon,
  isEditing,
  onMapTypeChange,
  onZoomChange,
  onDrawingModeToggle,
  onClearPolygon,
  onToggleEdit,
}) {
  const mapTypes = [
    {
      id: "satellite",
      icon: Satellite,
      label: "Satellite",
    },
    {
      id: "hybrid",
      icon: Layers,
      label: "Hybrid",
    },
    {
      id: "OS",
      icon: Grid,
      label: "OS Master Map",
    },
  ];

  const selectedStyle =
    "bg-havelock-blue/20 text-havelock-blue hover:bg-havelock-blue/80";
  const defaultStyle = "text-gray-600 hover:text-gray-900 hover:bg-gray-100";

  return (
    <div className="absolute right-4 bottom-4 flex flex-col gap-2 sm:right-6">
      <TooltipProvider>
        {/* Layer Controls */}
        <div className="bg-white rounded-lg border shadow-lg p-1 flex flex-col gap-1">
          {mapTypes.map(({ id, icon: Icon, label }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 ${mapType === id ? selectedStyle : defaultStyle}`}
                  onClick={() => onMapTypeChange(id)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Drawing Controls */}
        <div className="bg-white rounded-lg border shadow-lg p-1 flex flex-col gap-1">
          {!isEditing && !hasPolygon && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 ${
                    drawingMode === google.maps.drawing.OverlayType.POLYGON
                      ? selectedStyle
                      : defaultStyle
                  }`}
                  onClick={onDrawingModeToggle}
                >
                  <Pentagon className="h-4 w-4" />
                  <span className="sr-only">Draw boundary</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Draw boundary</p>
              </TooltipContent>
            </Tooltip>
          )}

          {hasPolygon &&
            drawingMode !== google.maps.drawing.OverlayType.POLYGON && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`w-8 h-8 ${isEditing ? selectedStyle : defaultStyle}`}
                      onClick={onToggleEdit}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">
                        {isEditing ? "Finish Editing" : "Edit boundary"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{isEditing ? "Finish Editing" : "Edit boundary"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`w-8 h-8 ${defaultStyle}`}
                      onClick={onClearPolygon}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Clear boundary</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Clear boundary</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
        </div>

        {/* Zoom Controls */}
        <div className="bg-white rounded-lg border shadow-lg p-1 flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`w-8 h-8 ${defaultStyle}`}
                onClick={() => onZoomChange("in")}
              >
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom in</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom in</p>
            </TooltipContent>
          </Tooltip>

          <div className="text-center py-1 text-sm font-medium text-gray-600">
            {zoomLevel}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`w-8 h-8 ${defaultStyle}`}
                onClick={() => onZoomChange("out")}
              >
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom out</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
