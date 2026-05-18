/**
 * កំណត់ចំណាំ: ម៉ូឌុល
 * ឯកសារ: src/shared/api/errors.js
 */
/**
 * ApiError — thrown by apiClient when a request fails.
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}
