export type ChestPresentation = "default" | "cinematic" | "explore";

export type Chest3DProps = {
  isFocused?: boolean;
  isUnlocked?: boolean;
  onSelect?: () => void;
  onRewardClick?: () => void;
  presentation?: ChestPresentation;
};

export type ChestCameraRigProps = {
  isFocused: boolean;
  presentation: ChestPresentation;
};

export type ChestPrototypeProps = {
  isFocused: boolean;
  isUnlocked: boolean;
  presentation: ChestPresentation;
  onSelect?: () => void;
  onRewardClick?: () => void;
};
