const today = new Date();

export const initialPeriodValues = {
    from: new Date(today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()).toLocaleDateString('en-CA'),
    till: today.toLocaleDateString('en-CA')
}
