import { UserType } from '@aws-sdk/client-cognito-identity-provider';

export const extractNameAndFamilyName = (userData: UserType): string => {
  const nameAttribute = userData.Attributes?.find((attr) => attr.Name === 'name');
  const familyNameAttribute = userData.Attributes?.find((attr) => attr.Name === 'family_name');

  return (nameAttribute?.Value || '') + ' ' + (familyNameAttribute?.Value || '');
};

export const getUserOptions = (userList?: UserType[]) => {
  let userArray;
  if (userList) {
    userArray = userList
      .map((user: UserType) => {
        return extractNameAndFamilyName(user);
      })
      .filter((fullName: string) => fullName !== ' ');
  }
  return userArray;
};
