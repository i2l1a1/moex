export function calculatePriceTicks(processedData, tickCount = 5) {
    const priceValues = processedData.map((item) => item.cost);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const priceRange = maxPrice - minPrice;
    const priceDomainMin = Math.floor(minPrice - priceRange * 0.1);
    const priceDomainMax = Math.ceil(maxPrice + priceRange * 0.1);

    const tickInterval = (priceDomainMax - priceDomainMin) / (tickCount - 1);

    const priceTicks = [];
    for (let i = 0; i < tickCount; ++i) {
        priceTicks.push(Math.round(priceDomainMin + i * tickInterval));
    }

    return {
        priceDomainMin,
        priceDomainMax,
        priceTicks,
    };
}
