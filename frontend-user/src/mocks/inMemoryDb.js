/**
 * កំណត់ចំណាំ: ម៉ូឌុល
 * ឯកសារ: src/mocks/inMemoryDb.js
 */
/**
 * In-memory development data. Delete this folder before production.
 */

export const mockGuests = [
    { id: 1, name: "ចន្ទ្រា សុខ", phone: "012 345 678", group: "គ្រួសារ", status: "បញ្ជាក់" },
    { id: 2, name: "សុខ វណ្ណដា", phone: "095 678 901", group: "មិត្តភក្ដិ", status: "រង់ចាំ" },
];

export const mockEvents = [];

export const inMemoryDb = {
    guests: mockGuests,
    events: mockEvents,
};

export default inMemoryDb;
