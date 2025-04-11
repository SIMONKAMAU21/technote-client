export const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  export const formatTime = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };
  export const formatSingleDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };