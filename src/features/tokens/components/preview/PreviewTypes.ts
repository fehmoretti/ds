import type { CSSProperties } from 'react';

export interface PreviewStyleProps {
  brandColor: string;
  accentColor: string;
  grayColor: string;
  errorColor: string;
  successColor: string;
  warningColor: string;
  cardRadius: number;
  buttonRadius: number;
  inputRadius: number;
  badgeRadius: number;
  fontFamily: string;
  monoFamily: string;
  previewBg: string;
  previewTextColor: string;
  previewDimmed: string;
  previewBorder: string;
  previewCardBg: string;
  previewShadowAlpha: string;
  sectionStyle: CSSProperties;
  sectionTitleProps: {
    size: 'sm';
    fw: number;
    mb: 'sm';
    style: CSSProperties;
  };
}
