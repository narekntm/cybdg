import {
    Gender,
    Role,
    Status,
    Subscription,
    UserData,
    UserDataFromView
} from "Models/Anahit Tadevosyan/UserManagementV2Model";
import Chance from "chance";
const chance = new Chance();
export class UserManagementGenerator {
    static staticUserOne: UserDataFromView = {
        "name": "Alice",
        "role": Role.Admin,
        "age": '30',
        "email": "alice@site.com",
        "gender": Gender.Female,
        "subscriptions": [Subscription.Newsletter],
        "status": Status.Active
}

    static staticUserTwo: UserDataFromView = {
        "name": "Bob",
        "role": Role.Viewer,
        "age": '25',
        "email": "bob@site.com",
        "gender": Gender.Male,
        "subscriptions": [Subscription.ProductUpdates],
        "status": Status.Inactive
    }

    static staticUserThree: UserDataFromView = {
        "name": "Eve",
        "role": Role.Editor,
        "age": '28',
        "email": "eve@site.com",
        "gender": Gender.Other,
        "subscriptions": [Subscription.Newsletter,Subscription.ProductUpdates],
        "status": Status.Active
    }
        static userPositiveCase: UserData = {
    name: "John",
    role: Role.Editor,
    age: "25",
    email: "john.smith@gmail.com",
    gender: Gender.Male,
    subscriptions: [Subscription.Newsletter],
    }
    static userFormPositiveCase: UserData & { status: Status } = {
        ...UserManagementGenerator.userPositiveCase,
        status: Status.Active,
    };
    static userNegativeName: UserData = {
        name: "%John%",
        role: Role.Editor,
        age: "25",
        email: "john.smith@gmail.com",
        gender: Gender.Male,
        subscriptions: [Subscription.Newsletter],
    }

    static userFormNegativeName: UserData & {status: Status} ={
        ...UserManagementGenerator.userNegativeName,
        status: Status.Active,
    }
    static userNegativeEmail: UserData = {
        name: "John",
        role: Role.Editor,
        age: "25",
        email: "john.smith",
        gender: Gender.Male,
        subscriptions: [Subscription.Newsletter],
    }
    static userFormNegativeEmail: UserData & {status: Status} ={
        ...UserManagementGenerator.userNegativeEmail,
        status: Status.Active,
    }
    static userNegativeAge: UserData = {
        name: "John",
        role: Role.Editor,
        age: "255",
        email: "john.smith@gmail.com",
        gender: Gender.Male,
        subscriptions: [Subscription.Newsletter],
    }

    static userFormNegativeAge: UserData & {status: Status} ={
        ...UserManagementGenerator.userNegativeAge,
        status: Status.Active,
    }
    static userEmptyDetails: UserData = {
        name: "",
        role: "" as any,
        age: "",
        email: "",
        gender: "" as any,
        subscriptions: [],
    }

    static userFormEmptyDetails: UserData & {status: Status} ={
        ...UserManagementGenerator.userEmptyDetails,
        status: Status.Active,
    }
    static randomUser: UserData = {
        name: chance.name().split(" ")[0],
        role: chance.pickone(Object.values(Role)),
        age: chance.integer({ min: 1, max: 100 }),
        email: chance.email(),
        gender: chance.pickone(Object.values(Gender)),
        subscriptions: chance.pickset(Object.values(Subscription), chance.integer({ min: 0, max: 2 })),
    }

}