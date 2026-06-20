/// <reference types="nativewind/types" />

declare module 'expo-linear-gradient' {
  import type { ComponentType } from 'react';
  import type { ViewProps } from 'react-native';

  export type LinearGradientPoint = {
    x: number;
    y: number;
  };

  export type LinearGradientProps = ViewProps & {
    colors: readonly [string, string, ...string[]];
    start?: LinearGradientPoint;
    end?: LinearGradientPoint;
    locations?: number[];
  };

  export const LinearGradient: ComponentType<LinearGradientProps>;
}

declare module 'expo-blur' {
  import type { ComponentType } from 'react';
  import type { ViewProps } from 'react-native';

  export type BlurIntensity = number;

  export type BlurTint = 'light' | 'dark' | 'default';

  export type BlurViewProps = ViewProps & {
    intensity?: BlurIntensity;
    tint?: BlurTint;
  };

  export const BlurView: ComponentType<BlurViewProps>;
}

declare module 'expo-haptics' {
  export enum NotificationFeedbackType {
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
  }

  export enum ImpactFeedbackStyle {
    Light = 'light',
    Medium = 'medium',
    Heavy = 'heavy',
  }

  export function notificationAsync(
    type: NotificationFeedbackType
  ): Promise<void>;

  export function impactAsync(
    style: ImpactFeedbackStyle
  ): Promise<void>;
}