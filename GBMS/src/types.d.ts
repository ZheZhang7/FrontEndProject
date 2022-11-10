export interface IUserData {
    username: string;
    password: string;
}
// ts对数据结构准确性的限制很严格
// IUserData,传递任意多个属性或者少个属性立刻报错