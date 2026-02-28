class CSVParser {
    /**
     * Parses a CSV string into an array of objects.
     * Assumes the first row contains headers.
     * @param {string} csvText - The raw CSV string.
     * @returns {Array<Object>} - An array of parsed JSON objects.
     */
    static parse(csvText) {
        if (!csvText || typeof csvText !== 'string') return [];

        const lines = csvText.trim().split(/\r?\n/);
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i];
            if (!currentLine.trim()) continue;

            const values = currentLine.split(',').map(v => v.trim());
            const obj = {};

            headers.forEach((header, index) => {
                obj[header] = values[index] !== undefined ? values[index] : '';
            });

            // Normalize common aliases
            if (obj.description && !obj.merchant) {
                obj.merchant = obj.description;
            }

            // Smart Categorization if Category is missing
            if (!obj.category || obj.category.trim() === '') {
                const textToMatch = (obj.merchant || '').toLowerCase();
                let assignedCat = 'Other';

                // Advanced Keyword Mapping
                const categoriesMap = {
                    'Food': ['zomato', 'swiggy', 'starbucks', 'mcdonalds', 'kfc', 'dominos', 'pizza', 'cafe', 'chaayos'],
                    'Shopping': ['amazon', 'flipkart', 'myntra', 'ajio', 'zara', 'h&m', 'ikea', 'shopping'],
                    'Transport': ['uber', 'ola', 'rapido', 'irctc', 'makemytrip', 'petrol', 'fuel', 'metro'],
                    'Entertainment': ['netflix', 'amazon prime', 'hotstar', 'spotify', 'bookmyshow', 'pvr', 'inox', 'youtube'],
                    'Travel': ['flight', 'indigo', 'spicejet', 'agoda', 'airbnb', 'hotel'],
                    'Health': ['pharmacy', 'apollo', 'pharmeasy', '1mg', 'hospital', 'clinic'],
                    'Groceries': ['bigbasket', 'blinkit', 'zepto', 'instamart', 'groceries', 'supermarket', 'reliance fresh'],
                    'Bills/Utilities': ['recharge', 'jio', 'airtel', 'vi', 'electricity', 'broadband', 'water bill'],
                    'Electronics': ['apple', 'croma', 'reliance digital', 'electronics'],
                    'Transfers': ['atm', 'withdrawal', 'phonepe', 'gpay', 'paytm', 'transfer']
                };

                for (const [catName, keywords] of Object.entries(categoriesMap)) {
                    if (keywords.some(kw => textToMatch.includes(kw))) {
                        assignedCat = catName;
                        break;
                    }
                }

                obj.category = assignedCat;
            }

            // Ensure amount is parsed as number
            if (obj.amount) {
                obj.numericAmount = parseFloat(obj.amount);
            }

            data.push(obj);
        }

        return data;
    }
}