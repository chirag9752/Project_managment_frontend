
const useCurrentWeekYear = (currentWeek) => {
    const startDate = new Date(currentWeek);
  
    // Adjust the start date to Monday (if today is Sunday, subtract 6 days; otherwise, subtract getDay() - 1)
    const dayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);
  
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End date is 6 days after start date
  
    // Format the dates in YYYY-MM-DD format
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if month < 10
      const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if day < 10
      return `${year}-${month}-${day}`;
    };
  
    return {
      weekStartDate: formatDate(startDate),
      weekEndDate: formatDate(endDate),
      year: startDate.getFullYear(),
    };
}

export default useCurrentWeekYear;