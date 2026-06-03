function formatDate(value) {
  if (!value) return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function toFutsalResponse(row, dates = []) {
  return {
    id: String(row.id),
    name: row.name,
    location: row.location,
    phone_number: row.phone_number,
    price: row.price_label || `$${Number(row.price_per_hour).toString()} per hour`,
    rating: row.rating,
    dates,
    image_url: row.image_url || row.imageurl,
  };
}

module.exports = {
  formatDate,
  toFutsalResponse,
};
