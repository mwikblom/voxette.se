export default class User {
  constructor(
    googleId: string | undefined,
    displayNameOrUserData: string | DisplayNameOrUserData | undefined | null,
    email: string | undefined | null,
    picture: string | undefined | null = "",
  ) {
    this.googleId = googleId;

    if (typeof displayNameOrUserData === "string") {
      const index = displayNameOrUserData.lastIndexOf(" ");

      this.firstName = index === -1 ? displayNameOrUserData : displayNameOrUserData.substring(0, index);
      this.lastName = index === -1 ? "" : displayNameOrUserData.substring(index + 1, displayNameOrUserData.length);
      this.email = email ?? undefined;
      this.picture = picture ?? undefined;
      this.part = "";
      this.tags = [];
    } else if (displayNameOrUserData && "firstName" in displayNameOrUserData) {
      this.savedUserData = displayNameOrUserData;
      this.firstName = displayNameOrUserData.firstName;
      this.lastName = displayNameOrUserData.lastName;
      this.email = displayNameOrUserData.email;
      this.picture = picture ?? displayNameOrUserData.pictureUrl;
      this.part = displayNameOrUserData.part;
      this.tags = displayNameOrUserData.tags;
      this.memberId = displayNameOrUserData.memberId;
      this.address = displayNameOrUserData.address;
      this.phone = displayNameOrUserData.phone;
      this.startDate = displayNameOrUserData.startDate;
    } else {
      this.email = email ?? undefined;
      this.picture = picture ?? undefined;
      this.firstName = "";
      this.lastName = "";
      this.part = "";
      this.tags = [];
    }
  }

  public savedUserData: DisplayNameOrUserData | undefined;
  public firstName: string | undefined;
  public lastName: string | undefined;
  public email: string | undefined;
  public googleId: string | undefined;
  public picture: string | undefined;
  public part: string | undefined;
  public tags: string[] | undefined;
  public memberId: string | undefined;
  public address: string | undefined;
  public phone: string | undefined;
  public startDate: string | undefined;

  get FirstName() {
    return this.firstName ?? "";
  }
  get LastName() {
    return this.lastName ?? "";
  }
  get Email() {
    return this.email ?? "";
  }
  get GoogleId() {
    return this.googleId ?? "";
  }
  get Picture() {
    return this.picture ?? "";
  }
  get Part() {
    return this.part ?? "";
  }
  get Tags() {
    return this.tags ?? [];
  }
  get MemberId() {
    return this.memberId ?? "";
  }
  get Address() {
    return this.address ?? "";
  }
  get Phone() {
    return this.phone ?? "";
  }
  get StartDate() {
    return this.startDate;
  }

  get AllUserData() {
    return {
      ...this.savedUserData,
      firstName: this.FirstName,
      lastName: this.LastName,
      email: this.Email,
      googleId: this.GoogleId,
      part: this.Part,
      tags: this.Tags,
      memberId: this.MemberId,
      address: this.Address,
      phone: this.Phone,
      pictureUrl: this.Picture,
    };
  }

  get InitialUserData() {
    return {
      googleId: this.GoogleId,
      firstName: this.FirstName,
      lastName: this.LastName,
      email: this.Email,
      pictureUrl: this.Picture,
    };
  }
}

export interface DisplayNameOrUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  pictureUrl?: string;
  part?: string;
  tags?: string[];
  memberId?: string;
  address?: string;
  phone?: string;

  googleId?: string;
  startDate?: string;
  allergies?: string;
}

export interface UserData {
  userData: DisplayNameOrUserData;
}
