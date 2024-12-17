"use client";

import {
  Grid,
  Layers,
  Map,
  Map as MapIcon,
  Mountain,
  Pencil,
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

type MapTypeId = "roadmap" | "satellite" | "hybrid" | "terrain" | "OS";

interface MapControlsProps {
  mapType: MapTypeId;
  zoomLevel: number;
  drawingMode: google.maps.drawing.OverlayType | null;
  hasPolygon: boolean;
  isEditing: boolean;
  onMapTypeChange: (type: MapTypeId) => void;
  onZoomChange: (action: "in" | "out") => void;
  onDrawingModeToggle: () => void;
  onClearPolygon: () => void;
  onToggleEdit: () => void;
}

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
}: MapControlsProps) {
  const mapTypes = [
    {
      id: "roadmap" as const,
      icon: MapIcon,
      label: "Roadmap",
    },
    {
      id: "satellite" as const,
      icon: Satellite,
      label: "Satellite",
    },
    {
      id: "hybrid" as const,
      icon: Layers,
      label: "Hybrid",
    },
    {
      id: "terrain" as const,
      icon: Mountain,
      label: "Terrain",
    },
    {
      id: "OS" as const,
      icon: Grid,
      label: "OS Master Map",
    },
  ];

  const selectedStyle =
    "bg-havelock-blue/20 text-havelock-blue hover:bg-havelock-blue/30";
  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <div className="absolute right-4 bottom-4 flex flex-col gap-2 sm:right-6">
      <TooltipProvider>
        {/* Layer Controls */}
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-lg p-1 flex flex-col gap-1">
          {mapTypes.map(({ id, icon: Icon, label }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 ${mapType === id ? selectedStyle : ""}`}
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
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-lg p-1 flex flex-col gap-1">
          {/* Only show draw button when not editing */}
          {!isEditing && !hasPolygon && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 ${drawingMode === google.maps.drawing.OverlayType.POLYGON ? selectedStyle : ""}`}
                  onClick={onDrawingModeToggle}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Draw boundary</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Draw boundary</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Only show edit and delete buttons when a polygon exists and not in drawing mode */}
          {hasPolygon &&
            drawingMode !== google.maps.drawing.OverlayType.POLYGON && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`w-8 h-8 ${isEditing ? selectedStyle : ""}`}
                      onClick={onToggleEdit}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">
                        {isEditing ? "Stop Editing" : "Edit boundary"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{isEditing ? "Stop Editing" : "Edit boundary"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
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
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-lg p-1 flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
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

          <div className="text-center py-1 text-sm font-medium">
            {zoomLevel}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
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
