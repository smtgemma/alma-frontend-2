const formatDate = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isCurrentYear = date.getFullYear() === now.getFullYear();

  // Today - show "Today" or "Tomorrow"
  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Tomorrow";
  }

  // This week - show weekday
  if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }

  // This year - show month and day
  if (isCurrentYear) {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  // Older than current year - include year
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default formatDate