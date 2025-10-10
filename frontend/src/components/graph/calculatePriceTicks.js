export function calculatePriceTicks(processedData, tickCount = 5) {
    const priceValues = processedData.map((item) => item.cost);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const priceDomainMin = Math.round(minPrice * 0.9);
    const priceDomainMax = Math.round(maxPrice * 1.1);

    const tickInterval = (priceDomainMax - priceDomainMin) / (tickCount - 1);

    const priceTicks = [];
    for (let i = 0; i < tickCount; ++i) {
        priceTicks.push(priceDomainMin + i * tickInterval);
    }

    return {
        priceDomainMin,
        priceDomainMax,
        priceTicks,
    };
}
