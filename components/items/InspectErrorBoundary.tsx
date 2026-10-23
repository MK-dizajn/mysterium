"use client";

import { Component, type ReactNode } from "react";

type InspectErrorBoundaryProps = {
  /** 3D zobrazenie spadlo – obrazovka sa prepne na 2D zálohu. */
  onError: () => void;
  children: ReactNode;
};

type InspectErrorBoundaryState = {
  hasError: boolean;
};

/** Zachytí chybu 3D zobrazenia (aj nenačítanú časť), aby hra nespadla. */
export class InspectErrorBoundary extends Component<
  InspectErrorBoundaryProps,
  InspectErrorBoundaryState
> {
  state: InspectErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): InspectErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}
