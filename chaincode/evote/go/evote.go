

package main

import (
 	"crypto"
 	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"bytes"
	"encoding/pem"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	"hash"
	"io"
        "encoding/hex"
)


// Define the Smart Contract structure
type SmartContract struct {
}


type Vote struct {
	Value       string `json:"value"`
}


func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()

	var result string
	var res_b []byte
	var err error 
	// Route to the appropriate handler function to interact with the ledger appropriately
        if function == "initLedger" {
		result, err = initLedger(APIstub)
	} else if function == "putVote" {
		result, err = putVote(APIstub, args)
	} else if function == "queryVote" {
		res_b, err = queryVote(APIstub, args)
                return shim.Success(res_b)
	}

	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte(result))
}

func initLedger(APIstub shim.ChaincodeStubInterface) (string, error) {
	
	return "", nil
}

func putVote(APIstub shim.ChaincodeStubInterface, args []string) (string, error) {

	if len(args) != 2 {
		return "", fmt.Errorf("Incorrect number of arguments. Expecting 2")
	}

	err := validateSignature(args)

	if err != nil {
		return "", err
	}

	var vote = []byte(args[1])

	err = APIstub.PutState(hex.EncodeToString([]byte(args[0])), vote)
	if err != nil {
		return "", fmt.Errorf("Failed to set vote %s", args[0])
	}

	return args[1], nil
}

// Hash vote (args[0]) and verify signature (args[1])
func validateSignature(args[] string) (error) {
    pemString := `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEA0QE8rqrlu6UEwrhsx7b5TKWREkle3srXzROMyy+eXtpM4qe0RVJW
IGRrhyj6woU0LKI7LLmChMn8N5OhxRYWWh23noTwly4rTo6zA0ruyi341tm0wwP3
rhOjl+zzkrXNt4ynb7ec7d1W9OSCjU2qojeSgJ5TLXQHZ+CS0d5vhphQNDCHld36
oGAZEUH9drjQZLfj8mDgljUSTrKdsltfYNaK1b8XIDKZarNVj9JKDj+GRTgvAf3I
uXm1cOAWS4MR6YVay8fIcuZE+cS4z55hfak2hR5EjMTZa+xEzuyUld/gcu4JAjDW
em67tFXVzJZTl2k4OoiVaDwsaEKNPBxDLQIDAQAB
-----END RSA PUBLIC KEY-----`

	
	block, _ := pem.Decode([]byte(pemString))
	publickey, err := x509.ParsePKCS1PublicKey(block.Bytes)
	if err != nil {
		return err
	}

	// func VerifyPKCS1v15(pub *PublicKey, hash crypto.Hash, hashed []byte, sig []byte) error
    vote := args[1];
    var sha hash.Hash
    sha = sha256.New()
    io.WriteString(sha, vote)
    vote_hash := sha.Sum(nil)
    err = rsa.VerifyPKCS1v15(publickey, crypto.SHA256, vote_hash, []byte(args[0]))
    if err != nil {
    	return err
    }

    return nil
}

func queryVote(APIstub shim.ChaincodeStubInterface, args[] string) ([]byte, error) {
    
    
        var buffer bytes.Buffer
        
        for i:= 0; i < len(args); i++{
            vote, err := APIstub.GetState(args[i])
            if err != nil{
                continue
            }
            buffer.Write(vote)
        }
        
        fmt.Printf("- queryAllVotes:\n%s\n", buffer.String())
        
        return buffer.Bytes(), nil       
}


func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}