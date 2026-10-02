import { UserRepository } from "@/lib/repositories/user";
import { CreateUserDTO, UpdateUserDTO } from "@/lib/interfaces/user.interface";
import { auth } from "@/lib/auth/auth";

const userRepository = new UserRepository();

export async function getUserByEmail(email: string) {
    return await userRepository.getUserByEmail(email);
}

export async function getUserById(id: string) {
    return await userRepository.getUserById(id);
}

export async function createUser(data: CreateUserDTO) {
    return await userRepository.createUser(data);
}

export async function deleteUser(id: string) {
    return await userRepository.deleteUser(id);
}

export async function updateUser(data: UpdateUserDTO) {
    return await userRepository.updateUser(data);
}

export async function getNumberTotalUsers(): Promise<number> {
    return await userRepository.getAllUser()
}


// Função para criar token e 
export async function hundleResetPasswordByEmailUser(email: string, url: string) {
    try {
        const result = await auth.api.requestPasswordReset({
            body: {
                email,
                redirectTo: url
            }
        })

        return {
            status: result.status,
            data: result.message,
            key: "SucessoNoProcessoDoEnvidoDoEmail"
        }
    } catch (e: any) {
        return {
            status: false,
            data: e,
            key: "ErroInternoNoEnvioDeEmail"
        }
    }
}