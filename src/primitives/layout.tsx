import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";

type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

const maxWidthMap: Record<ContainerMaxWidth, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: ContainerMaxWidth;
}

function Container({ className, maxWidth = "xl", children, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4", maxWidthMap[maxWidth], className)}
      {...props}
    >
      {children}
    </div>
  );
}

type GridCols = 1 | 2 | 3 | 4 | 5 | 6;
type GridGap = 1 | 2 | 3 | 4 | 6 | 8;

const colsMap: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const gapMap: Record<GridGap, string> = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
  gap?: GridGap;
}

function Grid({ className, cols = 1, gap = 4, children, ...props }: GridProps) {
  return (
    <div
      className={cn("grid", colsMap[cols], gapMap[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
}

type SectionPadding = "sm" | "md" | "lg";

const paddingMap: Record<SectionPadding, string> = {
  sm: "py-6",
  md: "py-12",
  lg: "py-20",
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: SectionPadding;
}

function Section({ className, padding = "md", children, ...props }: SectionProps) {
  return (
    <section className={cn(paddingMap[padding], className)} {...props}>
      {children}
    </section>
  );
}

type FlexDirection = "row" | "column";
type FlexAlign = "start" | "center" | "end" | "stretch";
type FlexJustify = "start" | "center" | "end" | "between" | "around";

const directionMap: Record<FlexDirection, string> = {
  row: "flex-row",
  column: "flex-col",
};
const alignMap: Record<FlexAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};
const justifyMap: Record<FlexJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: GridGap;
  wrap?: boolean;
}

function Flex({ className, direction = "row", align = "stretch", justify = "start", gap = 4, wrap, children, ...props }: FlexProps) {
  return (
    <div
      className={cn("flex", directionMap[direction], alignMap[align], justifyMap[justify], gapMap[gap], wrap && "flex-wrap", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: GridGap;
}

function VStack({ className, gap = 4, children, ...props }: StackProps) {
  return (
    <div className={cn("flex flex-col", gapMap[gap], className)} {...props}>
      {children}
    </div>
  );
}

function HStack({ className, gap = 4, children, ...props }: StackProps) {
  return (
    <div className={cn("flex flex-row items-center", gapMap[gap], className)} {...props}>
      {children}
    </div>
  );
}

type SpacerSize = "sm" | "md" | "lg" | "xl";
const spacerMap: Record<SpacerSize, string> = {
  sm: "h-4",
  md: "h-8",
  lg: "h-12",
  xl: "h-16",
};

interface SpacerProps {
  size?: SpacerSize;
}

function Spacer({ size = "md" }: SpacerProps) {
  return <div className={spacerMap[size]} aria-hidden />;
}

export { Container, Grid, Section, Flex, VStack, HStack, Spacer };
export type { ContainerProps, GridProps, SectionProps, FlexProps, StackProps, SpacerProps };
