function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // 使用 Math.floor() 可以获得包括最小值和最大值在内的整数
}
export default getRandomInt