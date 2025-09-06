import React from "react";
import ErrorState from "./ErrorState";
import Loading from "./Loading";
import EmptyState from "./EmptayState";
import { EmptyStateProps } from "./types";

interface WithEmptyStateProps<T> {
  data: T[];
  children: (data: T[]) => React.ReactNode;
  emptyStateProps?: Omit<EmptyStateProps, "action">;
  action?: React.ReactNode;
  loading?: boolean;
  error?: boolean | string;
  spinnerSize: "sm" | "md" | "lg";
  loadingTitle?: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
}

function WithEmptyState<T>({
  data,
  children,
  emptyStateProps,
  action,
  loading = false,
  error = false,
  loadingTitle,
  loadingMessage = "Fetching your latest data and updates...",
  spinnerSize = "md",
  errorTitle = "Error Fetching Data",
  errorMessage = "Something went wrong while fetching data.",
}: WithEmptyStateProps<T>): React.ReactElement {
  if (loading) {
    return (
      <Loading
        title={loadingTitle}
        spinnerSize={spinnerSize}
        message={loadingMessage}
      />
    ); // Replace with your loading component
  }

  if (error) {
    return (
      <ErrorState
        message={errorMessage}
        title={errorTitle}
        errorDetails={typeof error === "string" ? error : undefined}
      />
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState {...emptyStateProps} action={action} />;
  }

  return <>{children(data)}</>;
}

export default WithEmptyState;
